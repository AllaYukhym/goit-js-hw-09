import { Notify } from 'notiflix/build/notiflix-notify-aio';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const startRef = document.querySelector('[data-start]');
startRef.disabled = true;
let timeDeadline = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    timeDeadline = selectedDates[0];
    if (timeDeadline.getTime() < Date.now()) {
      Notify.failure('Please choose a date in the future', {
        backOverlay: true,
        closeButton: true,
      });
      startRef.disabled = true;
    } else {
      startRef.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

startRef.addEventListener('click', onStartClick);

function onStartClick() {
  timer.start(timeDeadline);
}

const timer = {
  intervalId: null,
  refs: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },
  notifyOptions: {
    backOverlay: true,
    closeButton: true,
  },
  start(deadline) {
    this.intervalId = setInterval(() => {
      const deltaTime = deadline.getTime() - Date.now();
      const data = this.convertMs(deltaTime);
      Object.entries(data).forEach(([name, value]) => {
        this.refs[name].textContent = this.addLeadingZero(value);
      });
    }, 1000);
  },
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
  },
  addLeadingZero(value) {
    return String(value).padStart(2, 0);
  },
};
