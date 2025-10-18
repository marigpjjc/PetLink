// padrino-app/screens/dog-profile/appointment.js
import { getDogById, createAppointment } from '../../services/api.js';

// Obtener el ID del perro
const dogId = localStorage.getItem('selectedDogId');

// Si no hay ID, volver al home
if (!dogId) {
  window.location.href = '../home/home.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const dogName = document.getElementById('dogName');
const calendar = document.getElementById('calendar');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const dateInput = document.getElementById('dateInput');
const startTimeButtons = document.getElementById('startTimeButtons');
const endTimeButtons = document.getElementById('endTimeButtons');
const scheduleButton = document.getElementById('scheduleButton');

// Variables para el calendario
let currentDate = new Date();
let selectedDate = null;
let selectedStartTime = null;
let selectedEndTime = null;

// Horarios disponibles
const timeSlots = [
  '08:00AM', '09:00AM', '10:00AM', '11:00AM',
  '12:00PM', '01:00PM', '02:00PM', '03:00PM',
  '04:00PM', '05:00PM', '06:00PM'
];

// Cargar la informacion del perro
async function loadDogInfo() {
  const dog = await getDogById(dogId);
  
  if (!dog) {
    alert('No se encontro el perro');
    window.location.href = '../home/home.html';
    return;
  }
  
  dogName.textContent = dog.name;
}

// Crear el calendario
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Mostrar mes y año
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  currentMonthElement.textContent = `${monthNames[month]} ${year}`;
  
  // Limpiar calendario
  calendar.innerHTML = '';
  
  // Dias de la semana
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  weekDays.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day calendar-header';
    dayElement.textContent = day;
    calendar.appendChild(dayElement);
  });
  
  // Primer dia del mes
  const firstDay = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  
  // Ultimo dia del mes
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  // Espacios vacios antes del primer dia
  for (let i = 0; i < adjustedFirstDay; i++) {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'calendar-day disabled';
    calendar.appendChild(emptyElement);
  }
  
  // Dias del mes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let day = 1; day <= lastDay; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    const currentDateCheck = new Date(year, month, day);
    currentDateCheck.setHours(0, 0, 0, 0);
    
    // Deshabilitar dias pasados
    if (currentDateCheck < today) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.addEventListener('click', function() {
        selectDate(year, month, day, this);
      });
    }
    
    calendar.appendChild(dayElement);
  }
}

// Seleccionar una fecha
function selectDate(year, month, day, element) {
  selectedDate = new Date(year, month, day);
  
  // Actualizar input de fecha
  const dateString = selectedDate.toISOString().split('T')[0];
  dateInput.value = dateString;
  
  // Marcar el dia seleccionado
  const allDays = document.querySelectorAll('.calendar-day:not(.calendar-header):not(.disabled)');
  allDays.forEach(d => d.classList.remove('selected'));
  element.classList.add('selected');
}

// Crear botones de horario
function createTimeButtons() {
  // Botones de hora de inicio
  startTimeButtons.innerHTML = '';
  timeSlots.forEach(time => {
    const button = document.createElement('button');
    button.className = 'time-button';
    button.textContent = time;
    button.addEventListener('click', () => selectStartTime(time, button));
    startTimeButtons.appendChild(button);
  });
  
  // Botones de hora de fin
  endTimeButtons.innerHTML = '';
  timeSlots.forEach(time => {
    const button = document.createElement('button');
    button.className = 'time-button';
    button.textContent = time;
    button.addEventListener('click', () => selectEndTime(time, button));
    endTimeButtons.appendChild(button);
  });
}

// Seleccionar hora de inicio
function selectStartTime(time, button) {
  selectedStartTime = time;
  
  // Quitar seleccion anterior
  const allButtons = startTimeButtons.querySelectorAll('.time-button');
  allButtons.forEach(b => b.classList.remove('selected'));
  
  // Marcar el seleccionado
  button.classList.add('selected');
}

// Seleccionar hora de fin
function selectEndTime(time, button) {
  selectedEndTime = time;
  
  // Quitar seleccion anterior
  const allButtons = endTimeButtons.querySelectorAll('.time-button');
  allButtons.forEach(b => b.classList.remove('selected'));
  
  // Marcar el seleccionado
  button.classList.add('selected');
}

// Mes anterior
prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

// Mes siguiente
nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Cuando se selecciona una fecha en el input
dateInput.addEventListener('change', (e) => {
  selectedDate = new Date(e.target.value + 'T00:00:00');
});

// Agendar la cita
scheduleButton.addEventListener('click', async () => {
  // Validar que todo este seleccionado
  if (!selectedDate) {
    alert('Por favor selecciona una fecha');
    return;
  }
  
  if (!selectedStartTime) {
    alert('Por favor selecciona una hora de inicio');
    return;
  }
  
  if (!selectedEndTime) {
    alert('Por favor selecciona una hora de fin');
    return;
  }
  
  // Obtener el usuario actual
  const userId = localStorage.getItem('userId') || 1;
  
  // Crear la cita
  const appointmentData = {
    id_user: parseInt(userId),
    id_dog: parseInt(dogId),
    date: selectedDate.toISOString().split('T')[0],
    start_time: selectedStartTime,
    end_time: selectedEndTime,
    state: 'pendiente'
  };
  
  console.log('Datos de cita a enviar:', appointmentData);
  
  const result = await createAppointment(appointmentData);
  
  console.log('Resultado:', result);
  
  if (result) {
    // EXITO - ir a pantalla de cita exitosa
    window.location.href = 'appointment-success.html';
  } else {
    // ERROR - ir a pantalla de error
    localStorage.setItem('errorMessage', 'No se pudo agendar la cita');
    localStorage.setItem('returnPage', 'appointment.html');
    window.location.href = 'error.html';
  }
});

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = 'dog-profile.html';
});

// Inicializar
loadDogInfo();
renderCalendar();
createTimeButtons();