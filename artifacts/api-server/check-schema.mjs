import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);
const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'questions' ORDER BY ordinal_position`;
console.log('questions columns:', cols.map(c => c.column_name).join(', '));
const testCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'tests' ORDER BY ordinal_position`;
console.log('tests columns:', testCols.map(c => c.column_name).join(', '));
await sql.end();
