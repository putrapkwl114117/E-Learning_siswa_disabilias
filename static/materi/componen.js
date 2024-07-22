  function updateClock() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
        }

        function updateCalendar() {
            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const daysWrapper = document.querySelector('.days');

            // Empty the previous content
            daysWrapper.innerHTML = '';

            // Add month name
            const monthName = document.createElement('div');
            monthName.textContent = monthNames[month];
            daysWrapper.appendChild(monthName);

            // Add days of the week
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            daysOfWeek.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.textContent = day;
                daysWrapper.appendChild(dayElement);
            });

            // Add days
            let dayCounter = 1;
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 7; j++) {
                    if ((i === 0 && j < startingDay) || dayCounter > daysInMonth) {
                        const emptyDay = document.createElement('div');
                        daysWrapper.appendChild(emptyDay);
                    } else {
                        const dayElement = document.createElement('div');
                        dayElement.textContent = dayCounter;
                        dayElement.classList.add('day');
                        daysWrapper.appendChild(dayElement);
                        dayCounter++;
                    }
                }
            }
        }

        // Panggil fungsi-fungsi update setiap detik
        setInterval(updateClock, 1000);
        updateClock(); // Panggil pertama kali agar jam tampil segera
        updateCalendar(); // Tampilkan tanggal pertama kali

        // Tampilkan kalender saat cursor mengarah ke area kalender
        document.querySelector('.calendar-wrapper').addEventListener('mouseenter', function () {
            document.querySelector('.calendar').classList.add('active');
        });

        // Sembunyikan kalender saat cursor meninggalkan area kalender
        document.querySelector('.calendar-wrapper').addEventListener('mouseleave', function () {
            document.querySelector('.calendar').classList.remove('active');
        });


        