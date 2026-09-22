import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cakfxqfdmwilqzkdzcib.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNha2Z4cWZkbXdpbHF6a2R6Y2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MTczNDcsImV4cCI6MjEwNTI5MzM0N30.lOBcmCmv637nSSYdmFkwpdfAQRH70TW6cGqTC1QC55M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);