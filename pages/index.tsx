import { useState, useEffect } from 'react';

export default function Home() {
  interface Appointment {
    id: string;
    patient: string;
    doctor: string;
    date: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState({ patient: '', doctor: '', date: '', reason: '' });

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ patient: '', doctor: '', date: '', reason: '' });
    fetchAppointments();
  };

  useEffect(() => { fetchAppointments(); }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Appointment Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" placeholder="Patient Name" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} />
        <input type="text" placeholder="Doctor Name" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
        {appointments.map((appt: Appointment) => (
        <div key={appt.id}>
          <input type="text" placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Book</button>
        </div>
        ))}
      </form>

      <h2 className="text-lg font-semibold mt-4">Appointments</h2>
      <ul className="list-disc ml-5">
        {appointments.map((appt: Appointment) => (
          <li key={appt.id}>
            {appt.patient} with Dr. {appt.doctor} on {new Date(appt.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
