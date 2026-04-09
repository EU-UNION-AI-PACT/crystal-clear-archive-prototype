import { createClient } from "https://esm.sh/@supabase/supabase-js@2.102.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  id_type: string;
  id_value: string;
  member_id_record: string;
}

interface VerificationResult {
  verified: boolean;
  details: Record<string, unknown>;
  source: string;
}

async function verifyLEI(value: string): Promise<VerificationResult> {
  try {
    const res = await fetch(`https://api.gleif.org/api/v1/lei-records/${encodeURIComponent(value)}`);
    if (!res.ok) {
      return { verified: false, details: { error: "LEI not found", status: res.status }, source: "GLEIF" };
    }
    const data = await res.json();
    const entity = data?.data?.attributes?.entity;
    return {
      verified: true,
      details: {
        legalName: entity?.legalName?.name,
        jurisdiction: entity?.jurisdiction,
        status: entity?.status,
        registrationStatus: data?.data?.attributes?.registration?.status,
      },
      source: "GLEIF",
    };
  } catch (e) {
    return { verified: false, details: { error: String(e) }, source: "GLEIF" };
  }
}

async function verifyORCID(value: string): Promise<VerificationResult> {
  try {
    // Normalize: accept with or without URL prefix
    const orcidId = value.replace(/^https?:\/\/orcid\.org\//, "").trim();
    const res = await fetch(`https://pub.orcid.org/v3.0/${encodeURIComponent(orcidId)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return { verified: false, details: { error: "ORCID not found", status: res.status }, source: "ORCID" };
    }
    const data = await res.json();
    const name = data?.person?.name;
    return {
      verified: true,
      details: {
        givenName: name?.["given-names"]?.value,
        familyName: name?.["family-name"]?.value,
        orcid: data?.["orcid-identifier"]?.path,
      },
      source: "ORCID",
    };
  } catch (e) {
    return { verified: false, details: { error: String(e) }, source: "ORCID" };
  }
}

async function verifyVAT(value: string): Promise<VerificationResult> {
  try {
    // Extract country code (first 2 chars) and number
    const countryCode = value.substring(0, 2).toUpperCase();
    const vatNumber = value.substring(2).replace(/\s/g, "");

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
        <soapenv:Body>
          <urn:checkVat>
            <urn:countryCode>${countryCode}</urn:countryCode>
            <urn:vatNumber>${vatNumber}</urn:vatNumber>
          </urn:checkVat>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const res = await fetch("https://ec.europa.eu/taxation_customs/vies/services/checkVatService", {
      method: "POST",
      headers: { "Content-Type": "text/xml; charset=utf-8" },
      body: soapBody,
    });

    const text = await res.text();
    const valid = text.includes("<valid>true</valid>");
    const nameMatch = text.match(/<name>([^<]*)<\/name>/);
    const addressMatch = text.match(/<address>([^<]*)<\/address>/);

    return {
      verified: valid,
      details: {
        valid,
        name: nameMatch?.[1] || null,
        address: addressMatch?.[1] || null,
        countryCode,
        vatNumber,
      },
      source: "VIES",
    };
  } catch (e) {
    return { verified: false, details: { error: String(e) }, source: "VIES" };
  }
}

async function verifyDUNS(value: string): Promise<VerificationResult> {
  // DUNS requires paid API access - we do format validation only
  const cleaned = value.replace(/[^0-9]/g, "");
  const valid = cleaned.length === 9;
  return {
    verified: false, // Can't auto-verify without API key
    details: {
      formatValid: valid,
      note: "DUNS-Nummer erfordert manuellen Abgleich (D&B API-Zugang erforderlich)",
      cleanedValue: cleaned,
    },
    source: "DUNS_FORMAT_CHECK",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify JWT
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: VerificationRequest = await req.json();
    const { id_type, id_value, member_id_record } = body;

    if (!id_type || !id_value || !member_id_record) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: VerificationResult;

    switch (id_type.toLowerCase()) {
      case "lei":
        result = await verifyLEI(id_value);
        break;
      case "orcid":
        result = await verifyORCID(id_value);
        break;
      case "vat":
      case "ust-id":
        result = await verifyVAT(id_value);
        break;
      case "duns":
        result = await verifyDUNS(id_value);
        break;
      default:
        result = {
          verified: false,
          details: { note: "Automatische Verifizierung für diesen Typ nicht verfügbar. Manuelle Prüfung erforderlich." },
          source: "MANUAL_REQUIRED",
        };
    }

    // Update the member_ids record with verification result
    await supabase
      .from("member_ids")
      .update({
        auto_verified: result.verified,
        verification_details: result.details,
      })
      .eq("id", member_id_record)
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
