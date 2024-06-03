// firebase-init.js에서 auth와 database를 임포트
import { auth, database } from './firebase-init.js';
import { ref, set, get, query, equalTo, orderByChild } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js';

let selectedDate = "";
let selectedTime = "";

document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.querySelectorAll(".calendar_days");
    const calendarTitle = document.querySelector(".title");
    const leftButton = document.querySelector(".left_button");
    const rightButton = document.querySelector(".right_button");

    class Calendar {
        constructor(year, month) {
            this.today = new Date(year, month);
            this.year = this.today.getFullYear();
            this.month = this.today.getMonth();
        }

        getFirstDay() {
            const firstDate = new Date(this.year, this.month);
            return firstDate.getDay();
        }

        getLastDay() {
            const lastDate = new Date(this.year, this.month + 1, 0);
            return lastDate.getDate();
        }

        fillCalendar() {
            this.initCalendar();
            calendarTitle.textContent = `${this.year}년 ${this.month + 1}월`;
            const firstDay = this.getFirstDay();
            const lastDay = this.getLastDay();
            let day = 1;
            for (let i = 0; i < 42; i++) { // 일반적으로 달력 칸은 42칸 (6주)
                if (i >= firstDay && day <= lastDay) {
                    calendarDays[i].innerHTML = `<button class="day_button">${day}</button>`;
                    day++;
                } else {
                    calendarDays[i].innerHTML = "";
                }
            }
            this.updateCalendarStyle();
        }

        initCalendar() {
            calendarDays.forEach(day => day.innerHTML = "");
        }

        updateCalendarStyle() {
            const dayButtons = document.querySelectorAll(".day_button");
            dayButtons.forEach(button => {
                button.addEventListener('click', event => {
                    dayButtons.forEach(btn => btn.classList.remove("selected"));
                    event.target.classList.add("selected");
                    handleDaySelection(event.target.textContent);
                });
            });
        }

        drawCalendar() {
            this.fillCalendar();

            leftButton.addEventListener("click", () => {
                if (this.month === 0) {
                    this.month = 11;
                    this.year -= 1;
                } else {
                    this.month -= 1;
                }
                this.fillCalendar();
            });

            rightButton.addEventListener("click", () => {
                if (this.month === 11) {
                    this.month = 0;
                    this.year += 1;
                } else {
                    this.month += 1;
                }
                this.fillCalendar();
            });
        }
    }

    const cal = new Calendar(new Date().getFullYear(), new Date().getMonth());
    cal.drawCalendar();
});

function handleDaySelection(day) {
    // 여기서 선택된 날짜를 바탕으로 추가적인 로직을 구현할 수 있습니다.
    console.log(`Selected day: ${day} of current month`);
    // 예를 들어, Firebase 데이터베이스에 예약 데이터 추가 등
}
