## Phase 1: Visuelle Verbesserungen (jetzt)
1. **Scroll-Indikator im Hero** — sanfte Bounce-Animation die zum Scrollen einlädt
2. **Alle Blur-Effekte entfernen** — kristallklare, scharfe Darstellung überall
3. **Scroll-Timeline hinzufügen** — visueller Fortschrittsindikator beim Scrollen

## Phase 2: Datenbank & Auth-System (jetzt)
4. **Datenbank-Tabellen erstellen**:
   - `profiles` (Name, Email, Telefon, Alter, 5-stellige Auth-ID)
   - `user_roles` (admin, member, viewer)
   - `registration_requests` (Pending-Requests für Admin-Genehmigung)
   - `member_ids` (DUNS, VAT, ORCID, LEI, PIC, UNGM, Handelsregister)
5. **Registrierung** — Formular mit Name, Email, Telefon, Alter + Email-Bestätigung
6. **Login-Seite** — styled wie Google/GitHub Login-Flow
7. **Admin-Credentials als Secrets speichern** (NICHT im Code!)

## Phase 3: Admin Panel (jetzt)
8. **Admin Dashboard** — nur für autorisierte Admins
   - Request-Queue: Registrierungsanfragen genehmigen/ablehnen
   - Member-Verwaltung: Bereiche zuweisen, IDs einsehen
   - ID-Verifizierung: Auto-Check + manuelle Bestätigung
9. **RLS-Policies** — sichere Zugriffskontrolle auf allen Tabellen

## Phase 4: Member-Bereich & ID-Verifizierung (jetzt)
10. **Member-Sektion** — Content nur für genehmigte Mitglieder
11. **ID-Verifizierung** — Formular für DUNS/VAT/ORCID/LEI/PIC/UNGM/Handelsregister
12. **Auto-Validierung** — API-Prüfung gegen GLEIF (LEI), ORCID etc.
13. **Anleitung** — Hilfeseite wo man IDs beantragen kann

## Phase 5: Wunschportal & Friedens-Features (jetzt)
14. **Wunschportal** — Herzenswünsche einreichen
15. **Wish Request Pool** — Admin verwaltet Wünsche
16. **Life-Ticker / Timeline-Viewer** — Live-Anzeige genehmigter Wünsche
17. **Email-Verteilung** — Admin kann per Drag&Drop Email-Adressen zuweisen
18. **Friedensengel-Button** — Zeichen für Zusammenhalt setzen
19. **Compliance-Sektion** — EU-UNION, Völkergrundgesetz, AI PACT, Digitalisierungs-PACT

## Sicherheit (durchgehend)
- Admin-Credentials in Secrets, NICHT im Code
- RLS auf allen Tabellen
- Email-Verifizierung für Registrierung
- Keine hardcoded Passwörter
- Compliance-konforme Datenverarbeitung

**Hinweis:** Aufgrund des Umfangs werde ich in mehreren Nachrichten arbeiten. Dieser erste Schritt umfasst Phase 1-2.