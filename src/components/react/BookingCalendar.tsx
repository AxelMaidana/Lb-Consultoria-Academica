import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import toast, { Toaster } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Mock available slots
const generateSlots = (date: Date) => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    for (let i = startHour; i < endHour; i++) {
        if (Math.random() > 0.3) { // Randomly available
            slots.push(`${i}:00`);
        }
    }
    return slots;
};

type BookingStep = 'date' | 'time' | 'form' | 'confirmation';

export default function BookingCalendar() {
    const [step, setStep] = useState<BookingStep>('date');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        reason: '',
        service: 'Consultoría Académica',
        modality: 'Online'
    });
    const [loading, setLoading] = useState(false);

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Load saved data
    useEffect(() => {
        const saved = localStorage.getItem('booking_user_data');
        if (saved) {
            setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
        }
    }, []);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setStep('time');
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setStep('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save user data for next time
        localStorage.setItem('booking_user_data', JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        }));

        setLoading(false);
        setStep('confirmation');
        toast.success('¡Turno reservado con éxito!');
    };

    const renderCalendar = () => {
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Start on Monday
        const days = [];
        for (let i = 0; i < 14; i++) { // Show 2 weeks
            days.push(addDays(startDate, i));
        }

        return (
            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
                    <div key={d} className="text-center text-sm font-medium text-slate-500 py-2">{d}</div>
                ))}
                {days.map((day, idx) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                    return (
                        <button
                            key={idx}
                            disabled={isPast}
                            onClick={() => handleDateSelect(day)}
                            className={twMerge(
                                "p-2 rounded-lg text-sm transition-all",
                                isSelected ? "bg-teal-600 text-white" : "hover:bg-teal-50 text-slate-700",
                                isPast && "opacity-30 cursor-not-allowed hover:bg-transparent"
                            )}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-w-2xl mx-auto">
            <Toaster position="bottom-center" />

            <div className="bg-teal-700 p-6 text-white">
                <h2 className="text-2xl font-serif font-bold">Agendar Cita</h2>
                <p className="opacity-90 text-sm mt-1">
                    {step === 'date' && 'Seleccioná un día'}
                    {step === 'time' && 'Seleccioná un horario'}
                    {step === 'form' && 'Completá tus datos'}
                    {step === 'confirmation' && '¡Listo!'}
                </p>
            </div>

            <div className="p-6">
                {step === 'date' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-lg capitalize">{format(currentMonth, 'MMMM yyyy', { locale: es })}</h3>
                            <div className="space-x-2">
                                {/* Simplified navigation for demo */}
                            </div>
                        </div>
                        {renderCalendar()}
                        <p className="text-xs text-slate-400 text-center mt-4">Mostrando próximas 2 semanas</p>
                    </div>
                )}

                {step === 'time' && (
                    <div>
                        <button onClick={() => setStep('date')} className="text-sm text-teal-600 mb-4 flex items-center">
                            &larr; Volver al calendario
                        </button>
                        <h3 className="font-medium mb-4">Horarios disponibles para el {selectedDate && format(selectedDate, 'dd/MM/yyyy')}</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {generateSlots(selectedDate!).map(time => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className="py-2 px-4 border border-teal-100 rounded-lg hover:bg-teal-50 text-teal-700 font-medium transition-colors"
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'form' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <button type="button" onClick={() => setStep('time')} className="text-sm text-teal-600 mb-2 flex items-center">
                            &larr; Volver a horarios
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nombre</label>
                                <input
                                    required
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Teléfono</label>
                            <input
                                required
                                type="tel"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Servicio</label>
                            <select
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
                                value={formData.service}
                                onChange={e => setFormData({ ...formData, service: e.target.value })}
                            >
                                <option>Consultoría Académica</option>
                                <option>Organización y Planificación</option>
                                <option>Orientación Vocacional</option>
                                <option>Gestión Social</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Modalidad</label>
                            <div className="mt-2 space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-teal-600"
                                        name="modality"
                                        value="Online"
                                        checked={formData.modality === 'Online'}
                                        onChange={e => setFormData({ ...formData, modality: e.target.value })}
                                    />
                                    <span className="ml-2">Online (Meet)</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        className="form-radio text-teal-600"
                                        name="modality"
                                        value="Presencial"
                                        checked={formData.modality === 'Presencial'}
                                        onChange={e => setFormData({ ...formData, modality: e.target.value })}
                                    />
                                    <span className="ml-2">Presencial (Palermo)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Motivo de consulta (breve)</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
                                rows={3}
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Procesando...' : 'Confirmar Reserva'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 'confirmation' && (
                    <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Reserva Confirmada!</h3>
                        <p className="text-slate-500 mb-6">
                            Te enviamos un email a <strong>{formData.email}</strong> con los detalles del encuentro.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg text-left max-w-sm mx-auto mb-8">
                            <p className="text-sm text-slate-600"><strong>Fecha:</strong> {selectedDate && format(selectedDate, 'dd/MM/yyyy')}</p>
                            <p className="text-sm text-slate-600"><strong>Hora:</strong> {selectedTime}</p>
                            <p className="text-sm text-slate-600"><strong>Servicio:</strong> {formData.service}</p>
                            <p className="text-sm text-slate-600"><strong>Modalidad:</strong> {formData.modality}</p>
                        </div>
                        <button
                            onClick={() => {
                                setStep('date');
                                setSelectedDate(null);
                                setSelectedTime(null);
                            }}
                            className="text-teal-700 font-medium hover:text-teal-900"
                        >
                            Agendar otro turno
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
