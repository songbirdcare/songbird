-- migrate:up
INSERT INTO
  providers (role, first_name, last_name, email)
VALUES
  (
    'BCBA',
    'Brianna',
    'Burkhard',
    'briannab@songbirdcare.com'
  ),
  (
    'BCBA',
    'Erika',
    'Knight',
    'erikak@songbirdcare.com'
  ),
  (
    'BCBA',
    'Andra',
    'Cojocaru',
    'andrac@songbirdcare.com'
  ),
  (
    'BCBA',
    'Laura',
    'Ackerman',
    'lauraa@songbirdcare.com'
  ),
  (
    'BCBA',
    'Ali',
    'Miller',
    'alexandriam@songbirdcare.com'
  ),
  (
    'BCBA',
    'Hannah',
    'Andreasen',
    'hannaha@songbirdcare.com'
  ),
  (
    'BCBA',
    'Rachel',
    'Gerardi',
    'rachelg@songbirdcare.com'
  ),
  (
    'BCBA',
    'Jen',
    'Baker',
    'jenniferb@songbirdcare.com'
  ),
  (
    'BCBA',
    'Angela',
    'Jung',
    'angelaj@songbirdcare.com'
  ),
  (
    'BCBA',
    'Connie',
    'Yu',
    'conniey@songbirdcare.com'
  ),
  (
    'BCBA',
    'Keely',
    'Castillo',
    'keelyc@songbirdcare.com'
  ) ON CONFLICT (email) DO NOTHING;

-- migrate:down
TRUNCATE providers;
