const calendarDays = document.querySelectorAll(".calendar_days"),
    calendarTitle = document.querySelector(".title"),
    leftButton = document.querySelector(".left_button"),
    rightButton = document.querySelector(".right_button"),
    calendar = document.querySelector(".calendar");
    // dateUpdate = document.querySelector(".date_update");


    class Calendar {
        constructor(year, month) {
            this.today = new Date(year, month);
            this.year = this.today.getFullYear(),
            this.month = this.today.getMonth(),
            this.date = this.today.getDate(),
            this.day = this.today.getDay()
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
            calendarTitle.innerHTML = `${this.year}년 ${this.month + 1}월`;
            const firstDay = this.getFirstDay();
            const lastDay = this.getLastDay();
            let day = 1;
            for (let i = 0; i < calendarDays.length; i++) {
                if (i >= firstDay && day <= lastDay) {
                    calendarDays[i].innerHTML = `<button class="day_button">${day}</button>`;
                    day++;
                } else {
                    calendarDays[i].innerHTML = "";
                }
            }
        }
    
        initCalendar() {
            calendarDays.forEach((day) => {
                day.innerHTML = "";
            });
        }
    
        drawCalendar() {
            let change = 0;
            const today = new Date();
            let calendarInstance = new Calendar(today.getFullYear(), today.getMonth() + change);
    
            calendarInstance.fillCalendar();
    
            leftButton.addEventListener("click", (e) => {
                e.stopPropagation();
                change--;
                calendarInstance = new Calendar(today.getFullYear(), today.getMonth() + change);
                calendarInstance.fillCalendar();
            });
    
            rightButton.addEventListener("click", (e) => {
                e.stopPropagation();
                change++;
                calendarInstance = new Calendar(today.getFullYear(), today.getMonth() + change);
                calendarInstance.fillCalendar();
            });
        }
    
        updateCalendarStyle() {
            const dayButtons = document.querySelectorAll(".day_button");
    
            // 달력 날짜들에 클릭 이벤트 추가
            dayButtons.forEach((element) => {
                element.addEventListener("click", (event) => {
                    // 다른 모든 선택 제거
                    dayButtons.forEach((btn) => btn.classList.remove("day_selected"));
                    // 현재 클릭한 날짜만 선택 표시
                    event.target.classList.add("day_selected");
                });
            });
    
            // 달력 날짜들에 호버링 이벤트 추가
            dayButtons.forEach((element) => {
                element.addEventListener("mouseenter", (event) => {
                    event.target.classList.add("day_hover");
                });
                element.addEventListener("mouseleave", (event) => {
                    event.target.classList.remove("day_hover");
                });
            });
        }
    
        handleEvents() {
            this.drawCalendar();
            this.updateCalendarStyle();
        }
    }
    
    const cal = new Calendar(new Date().getFullYear(), new Date().getMonth());
    cal.handleEvents();
    