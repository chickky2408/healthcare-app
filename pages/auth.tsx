

// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';

// export default function AuthPage() {
//   const router = useRouter();
//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({ email: '', password: '', name: '', role: 'user' });
//   const [error, setError] = useState('');

//   const handleToggle = () => {
//     setIsLogin(!isLogin);
//     setError('');
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch('/api/auth', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ ...form, action: isLogin ? 'login' : 'register' }),
//     });
//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || 'Something went wrong.');
//       return;
//     }

//     localStorage.setItem('user', JSON.stringify(data));
//     if (data.role === 'admin') router.push('/admin');
//     else if (data.role === 'doctor') router.push('/doctor');
//     else router.push('/dashboard');
//   };

//   return (
//     <>
// <Head>
//   <title>{isLogin ? 'Login' : 'Register'} | Dental Care</title>
// </Head>
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-blue-50 px-4 font-[Poppins]">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
//           <h2 className="text-2xl font-bold text-center text-blue-700">
//             {isLogin ? 'Welcome Back!' : 'Create an Account'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Full Name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//                 <select
//                   name="role"
//                   value={form.role}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="user">User</option>
//                   <option value="doctor">Doctor</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </>
//             )}
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               required
//             />
//             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-md"
//             >
//               {isLogin ? 'Login' : 'Register'}
//             </button>
//           </form>
//           <p className="text-center text-sm">
//             {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//             <button className="text-blue-600 underline" onClick={handleToggle}>
//               {isLogin ? 'Register here' : 'Login here'}
//             </button>
//           </p>
//         </div>
// </div>
//     </>
//   );
// }



//separate 3 role 

// pages/auth.tsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isRegister ? "register" : "login", name, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/${role}`); // redirect ไป /user, /doctor, /admin
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
          {isRegister ? "Create an Account" : "Welcome Back!"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegister && (
            <select
              className="w-full border rounded px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setIsRegister(false)} className="text-blue-600 underline">
                Login here
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => setIsRegister(true)} className="text-blue-600 underline">
                Register here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
