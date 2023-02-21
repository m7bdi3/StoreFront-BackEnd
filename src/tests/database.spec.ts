const { Client } = require('pg');
const client = new Client();

describe('Test Database', () => {
  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it('should have a users table', async () => {
    const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    expect(res.rows[0].exists).toBeTruthy();
  });

  it('should have the expected columns in the users table', async () => {
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);

    const columns = res.rows.map((row: { column_name: any; }) => row.column_name);
    expect(columns).toContain('id');
    expect(columns).toContain('username');
    expect(columns).toContain('firstname');
    expect(columns).toContain('lastname');
    expect(columns).toContain('password_digest');

    const id = res.rows.find((row: any) => row.column_name === 'id');
    expect(id.data_type).toBe('integer');
    expect(id.is_nullable).toBe('NO');

    const username = res.rows.find((row: any) => row.column_name === 'username');
    expect(username.data_type).toBe('character varying');
    expect(username.character_maximum_length).toBe(250);
    expect(username.is_nullable).toBe('NO');

    const firstname = res.rows.find((row: any) => row.column_name === 'firstname');
    expect(firstname.data_type).toBe('character varying');
    expect(firstname.character_maximum_length).toBe(250);
    expect(firstname.is_nullable).toBe('NO');

    const lastname = res.rows.find((row: any) => row.column_name === 'lastname');
    expect(lastname.data_type).toBe('character varying');
    expect(lastname.character_maximum_length).toBe(250);
    expect(lastname.is_nullable).toBe('NO');

    const passwordDigest = res.rows.find((row: any) => row.column_name === 'password_digest');
    expect(passwordDigest.data_type).toBe('character varying');
    expect(passwordDigest.character_maximum_length).toBe(250);
    expect(passwordDigest.is_nullable).toBe('NO');
  });
});
