function updateClock() {
    const now = new Date();

    // Czas dla różnych miast
    const times = {
        warsaw: new Intl.DateTimeFormat('pl-PL', { timeZone: 'Europe/Warsaw', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(now),
        london: new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(now),
        beijing: new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(now),
        newyork: new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(now)
    };

    for (const city in times) {
        const timeString = times[city];
        const [hours, minutes, seconds] = timeString.split(':').map(Number);

        // Aktualizacja cyfrowego wyświetlania czasu
        document.getElementById(`digital-time-${city}`).textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Ustawianie kątów dla wskazówek
        const hourHand = document.getElementById(`hour-hand-${city}`);
        const minuteHand = document.getElementById(`minute-hand-${city}`);
        const secondHand = document.getElementById(`second-hand-${city}`);

        // Ustalanie kątów dla wskazówek zegara
        hourHand.style.transform = `rotate(${(hours % 12) * 30 + (minutes / 2)}deg)`; // 30 stopni na godzinę
        minuteHand.style.transform = `rotate(${minutes * 6}deg)`; // 6 stopni na minutę
        secondHand.style.transform = `rotate(${seconds * 6}deg)`; // 6 stopni na sekundę
    }
}

// Aktualizacja zegarów co sekundę
setInterval(updateClock, 1000);
// Inicjalizacja zegarów przy załadowaniu strony
updateClock();