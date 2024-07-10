import { auth, database } from './firebase-init.js';
import { ref, set, get, query, equalTo, orderByChild, push } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js';

let selectedDate = "";
let selectedTime = "";
let selectedClassroom = ""; // 추가된 교실 선택 변수

document.addEventListener('DOMContentLoaded', function() {
    // 날짜 선택 핸들러
    document.getElementById('datePicker').addEventListener('change', function() {
        selectedDate = this.value;
    });

    // 시간 선택 버튼에 이벤트 리스너 추가
    const timeButtons = document.querySelectorAll('#time-container button');
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectTime(this.textContent.trim());
            updateButtonStyles(this);
        });
    });

    // 교실 선택 버튼에 이벤트 리스너 추가
    const classButtons = document.querySelectorAll('#class-container button');
    classButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedClassroom = this.textContent.trim();
            updateClassButtonStyles(this);
        });
    });

    // 예약하기 버튼에 이벤트 리스너 추가
    document.getElementById('submitReservationButton').addEventListener('click', submitReservation);
});

// 시간 선택 함수
function selectTime(time) {
    selectedTime = time;
    console.log(`Selected time: ${selectedTime}`);
}

// 버튼 스타일 업데이트 함수 (시간)
function updateButtonStyles(clickedButton) {
    const buttons = document.querySelectorAll('#time-container button');
    buttons.forEach(button => {
        if (button === clickedButton) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

// 버튼 스타일 업데이트 함수 (교실)
function updateClassButtonStyles(clickedButton) {
    const buttons = document.querySelectorAll('#class-container button');
    buttons.forEach(button => {
        if (button === clickedButton) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

async function submitReservation() {
    if (!selectedDate || !selectedTime || !selectedClassroom) {
        alert('날짜, 시간, 교실을 모두 선택해주세요.');
        return;
    }

    const user = auth.currentUser;
    if (user) {
        const reservationKey = `${selectedDate}_${selectedTime}_${selectedClassroom}`;
        const reservationsRef = ref(database, 'reservations/' + reservationKey);

        const snapshot = await get(reservationsRef);
        if (snapshot.exists()) {
            alert('이미 예약된 날짜, 시간, 교실입니다. 다른 날짜나 시간을 선택해 주세요.');
            return;
        }

        set(reservationsRef, {
            userId: user.uid,
            date: selectedDate,
            time: selectedTime,
            classroom: selectedClassroom
        }).then(() => {
            alert('예약이 완료되었습니다.');
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    } else {
        alert('로그인이 필요합니다.');
    }
}


// 로그인 상태 변경 감지
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User is signed in with UID:", user.uid);
    } else {
        console.log("No user is signed in.");
    }
});