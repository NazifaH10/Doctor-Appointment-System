export const formatTime = (time) => {

    let [hour, minute] =
        time.split(":");

    hour = Number(hour);

    const ampm =
        hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;

};