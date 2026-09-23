export const generateSlots = (startTime, endTime) => {

    const slots = [];

    const toMinutes = (time) => {

        const [h, m] = time.split(":").map(Number);

        return h * 60 + m;

    };

    const toTime = (minutes) => {

        const hour = Math.floor(minutes / 60);

        const minute = minutes % 60;

        return `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

    };

    let start = toMinutes(startTime);

    const end = toMinutes(endTime);

    while (start <= end) {

        slots.push(toTime(start));

        start += 30;

    }

    return slots;

};