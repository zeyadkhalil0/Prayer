import React, { useEffect, useState } from "react";
const Home = () => {
  const [SelectedCity, SetselectedCity] = useState("");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [countdown, setCountdown] = useState("");


  let Today = new Date();
  let FormatDate = ` ${Today.getDate()} - ${
    Today.getMonth() + 1
  } - ${Today.getFullYear()}`;

  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour}:${minute} ${period}`;
  };
  const getNextPrayer = (timings) => {
    if (!timings) return null;

    const now = new Date();

    const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    for (let i = 0; i < order.length; i++) {
      const name = order[i];
      const timeString = timings[name]; 
      if (!timeString) continue;

      const [hour, minute] = timeString.split(":").map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hour, minute, 0, 0);

      if (prayerTime > now) {
        return { name, time: timeString };
      }
    }
    return { name: "Fajr", time: timings["Fajr"] };
  };
  useEffect(() => {
  if (!prayerTimes) return;

  const nextPrayer = getNextPrayer(prayerTimes);
  if (!nextPrayer) return;

  const updateCountdown = () => {
    const now = new Date();
    const [hour, minute] = nextPrayer.time.split(":").map(Number);
    const nextPrayerDate = new Date();
    nextPrayerDate.setHours(hour, minute, 0, 0);

    let diff = (nextPrayerDate - now) / 1000; // فرق بالثواني
    if (diff < 0) diff += 24 * 60 * 60; // لو عدت الصلاة، نضيف 24 ساعة

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = Math.floor(diff % 60);

    setCountdown(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  };

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);

  return () => clearInterval(interval);
}, [prayerTimes]);

const nextPrayer = getNextPrayer(prayerTimes);

  const prayerNames = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  };
  const allowedPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const governorates = {
    القاهرة: "Cairo",
    الإسكندرية: "Alexandria",
    الجيزة: "Giza",
    الدقهلية: "Dakahlia",
    "البحر الاحمر": "RedSea",
    البحيرة: "Beheira",
    الفيوم: "Faiyum",
    الغربية: "Gharbia",
    الإسماعيلية: "Ismailia",
    المنوفية: "Monufia",
    المنيا: "Minya",
    القليوبية: "Qalyubia",
    "الوادي الجديد": "New Valley",
    السويس: "Suez",
    اسوان: "Aswan",
    أسيوط: "Asyut",
    "بني سويف": "Beni Suef",
    بورسعيد: "Port Said",
    دمياط: "Damietta",
    الشرقية: "Sharqia",
    "جنوب سيناء": "South Sinai",
    "كفر الشيخ": "Kafr El Sheikh",
    مطروح: "Matruh",
    الأقصر: "Luxor",
    قنا: "Qena",
    سوهاج: "Sohag",
    "شمال سيناء": "North Sinai",
  };

  const HandleChange = (e) => {
    SetselectedCity(e.target.value);
  };
  useEffect(() => {
    if (SelectedCity) {
      fetch(
        `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${SelectedCity}&method=5`
      )
        .then((response) => response.json())
        .then((data) => {
          setPrayerTimes(data.data.timings);
        })
        .catch((error) => console.error("error data :", error));
    }
  });
  return (
    <>
      <section className="Header flex flex-col justify-center items-center">
        <div className="md:ml-[55%] space-y-6  w-[90%] md:w-2/5  px-4 py-6 bg-black/40 md:backdrop-blur-md rounded-2xl shadow-2xl">
          {/* Header */}
          <main className="flex flex-row-reverse items-center justify-between  text-white">
            {/* Select Country */}
            <div
              className="flex flex-col items-center md:space-y-4 space-y-2"
              dir="rtl"
            >
              <p className="md:text-lg  font-semibold">
                المدينة :{" "}
                {Object.keys(governorates).find(
                  (key) => governorates[key] === SelectedCity
                ) || "لم يتم الاختيار"}
              </p>
              <select
                name="Cities"
                id=""
                value={SelectedCity}
                onChange={HandleChange}
                className="bg-red-800/50 px-4 py-2 rounded-xl "
              >
                <option value="">اختر المحافظة</option>
                {Object.entries(governorates).map(([arabic, english]) => (
                  <option key={english} value={english}>
                    {arabic}
                  </option>
                ))}
              </select>
            </div>
            {/* Date */}
            <div
              className="md:space-y-4 space-y-2 md:text-xl font-semibold "
              dir="rtl"
            >
              <h1>التاريخ</h1>
              <p dir="ltr">{FormatDate}</p>
            </div>
            {nextPrayer && (
  <div className="text-center text-white space-y-2 px-1 py-2  ">
    <h2 className="text-md font-bold">
  الصلاة القادمة: {prayerNames[nextPrayer.name]}
    </h2>
    <p className="text-xl  bg-green-600/40 rounded-xl">{countdown}</p>
  </div>
)}
          </main>
          <hr />
          {/* Prayer Times */}
          <main className="space-y-6">
            {prayerTimes ? (
              Object.entries(prayerTimes)
                .filter(([name]) => allowedPrayers.includes(name))
                .map(([name, times]) => (
                  <div
                    className="flex  justify-between bg-red-500/30   px-8 py-4 rounded-lg text-white text-xl"
                    dir="rtl"
                  >
                    <h1>{prayerNames[name] || name}</h1>
                    <p>{convertTo12Hour(times)}</p>
                  </div>
                ))
            ) : (
              <p className="text-center text-white font-semibold">
                اختر محافظة لعرض مواقيت الصلاة
              </p>
            )}
          </main>
        </div>
      </section>
    </>
  );
};

export default Home;
