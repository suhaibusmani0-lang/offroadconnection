import { redirect } from 'next/navigation';

export default function AdminLoginPage() {
  redirect('http://localhost:8000/admin/login.php');
}

