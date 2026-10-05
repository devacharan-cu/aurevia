// Replaces static hours with a live "Open now · until 19:00" line, calculated in London time.
// Hours come from site settings via data-open-status='{"1":[8,19], …}' (0 = Sunday).
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fmt = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

function londonNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(new Date()).map((p) => [p.type, p.value]),
  );
  return { day: DAYS.indexOf(parts.weekday), time: Number(parts.hour) % 24 + Number(parts.minute) / 60 };
}

export function initOpenStatus() {
  document.querySelectorAll('[data-open-status]').forEach((el) => {
    let hours;
    try { hours = JSON.parse(el.dataset.openStatus); } catch { return; }
    const { day, time } = londonNow();
    const today = hours[day];
    let text;
    if (today && time >= today[0] && time < today[1]) {
      text = `Open now · until ${fmt(today[1])}`;
    } else if (today && time < today[0]) {
      text = `Opens today at ${fmt(today[0])}`;
    } else {
      let d = day;
      for (let i = 0; i < 7; i++) { d = (d + 1) % 7; if (hours[d]) break; }
      const when = d === (day + 1) % 7 ? 'tomorrow' : DAYS[d];
      text = hours[d] ? `Closed · opens ${when} at ${fmt(hours[d][0])}` : el.textContent;
    }
    el.textContent = text;
    el.title = 'London time';
  });
}
