import { auth, database } from './firebase-init.js';
import { ref, set, get, push } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js';

let selectedDate = "";
let selectedTime = "";
let selectedClassroom = "";

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
        format: 'yyyy-mm-dd',
        i18n: {
            months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
            weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
            weekdaysAbbrev: ['일', '월', '화', '수', '목', '금', '토']
        }
    });

    $('#calendar').fullCalendar({
        locale: 'ko',
        selectable: true,
        selectHelper: true,
        select: function(start, end) {
            if (selectedDate) {
                clearSelectedDate();
            }
            selectedDate = start.format('YYYY-MM-DD');
            console.log('Selected date: ' + selectedDate);
            updateCalendarStyles();
        },
        dayRender: function(date, cell) {
            if (date.format('YYYY-MM-DD') === selectedDate) {
                cell.addClass('selected-date');
            } else {
                cell.removeClass('selected-date');
            }
        }
    });

    // 시간 선택 버튼에 이벤트 리스너 추가
    const timeButtons = document.querySelectorAll('#time-container button');
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectTime(this.textContent.trim());
            updateButtonStyles(this);
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

// 이전 선택된 날짜의 스타일을 제거하는 함수
function clearSelectedDate() {
    $('#calendar').find('.fc-day').each(function() {
        $(this).removeClass('selected-date');
    });
}

// 캘린더 스타일 업데이트 함수
function updateCalendarStyles() {
    $('#calendar').fullCalendar('rerenderEvents');
    setTimeout(function() {
        $('#calendar').find('.fc-day').each(function() {
            const date = $(this).data('date');
            if (date === selectedDate) {
                $(this).addClass('selected-date');
            }
        });
    }, 0);
}

function checkAvailability(date) {
    const dateRef = ref(database, 'reservations/' + date);
    get(dateRef).then(snapshot => {
        if (snapshot.exists()) {
            const reservedTimes = snapshot.val();
            document.querySelectorAll('#time-container button').forEach(button => {
                if (reservedTimes[button.textContent]) {
                    button.disabled = true;
                } else {
                    button.disabled = false;
                }
            });
        } else {
            document.querySelectorAll('#time-container button').forEach(button => {
                button.disabled = false;
            });
        }
    }).catch(error => {
        console.error('Error checking availability: ', error);
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
            closeModal();
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

const modalBackground = document.getElementById('modalBackground');
const modal = document.getElementById('modal');
const roomImage = document.getElementById('roomImage');
const roomDescription = document.getElementById('roomDescription');
const closeModalBtn = document.getElementById('closeModalBtn');

window.showModal = function(roomId) {
    selectedClassroom = roomId;
    console.log('Selected classroom: ' + selectedClassroom);

    let roomImageSrc = '';
    let imageDescription = '';

    if (roomId === '학생활동실1') {
        roomImageSrc = '4F_yellow.png'; // 본관 4층 이미지 경로
        imageDescription = '학생활동실 1'; // 이미지 설명 설정
    } else if (roomId === '학생활동실2') {
        roomImageSrc = '2F_yellow.png'; // 본관 3층 이미지 경로
        imageDescription = '학생활동실 2'; // 이미지 설명 설정
    } else if (roomId === '학생활동실4') {
        roomImageSrc = '4F_yellow_extension.png'; // 별관 2층 이미지 경로
        imageDescription = '학생활동실 4'; // 이미지 설명 설정
    }

    roomImage.src = roomImageSrc;
    roomDescription.textContent = imageDescription;

    modal.style.display = 'block';
    modalBackground.style.display = 'block';
}

window.closeModal = function() {
    selectedDate = "";
    selectedTime = "";
    selectedClassroom = "";

    clearSelectedDate();
    updateButtonStyles(null); // Clear time button styles
    updateCalendarStyles(); // Update calendar to remove selected date style

    modal.style.display = 'none';
    modalBackground.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modalBackground) {
        closeModal();
    }
}
