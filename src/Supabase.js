import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   "https://yniaizrehoncsigyivhp.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluaWFpenJlaG9uY3NpZ3lpdmhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc3MDIzNiwiZXhwIjoyMDY4MzQ2MjM2fQ.E_uiWM0m3FY8blPExAYAuEefnniHBEFPTyMQTkxM1Gs"
// );

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
