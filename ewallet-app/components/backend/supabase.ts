import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wqrljunvjdbnqmemlyhk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcmxqdW52amRibnFtZW1seWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MTI3NjYsImV4cCI6MjA0OTQ4ODc2Nn0.9g-5Z3aNLDDsefooy4ChplqaxB4u-0RPXzepHoASsG0'
);
