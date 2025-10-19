import React, { useEffect, useState } from "react";
const Home = () => {
  const [SelectedCity, SetselectedCity] = useState("");
  const [prayerTimes, setPrayerTimes] = useState(null);

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
const prayerNames = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};
const allowedPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const governorates = [
    "القاهرة",
    "الإسكندرية",
    "الجيزة",
    "الدقهلية",
    "البحر الأحمر",
    "البحيرة",
    "الفيوم",
    "الغربية",
    "الإسماعيلية",
    "المنوفية",
    "المنيا",
    "القليوبية",
    "الوادي الجديد",
    "السويس",
    "اسوان",
    "أسيوط",
    "بني سويف",
    "بورسعيد",
    "دمياط",
    "الشرقية",
    "جنوب سيناء",
    "كفر الشيخ",
    "مطروح",
    "الأقصر",
    "قنا",
    "سوهاج",
    "شمال سيناء",
  ];
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
      <section className="Header">
        <div className="  absolute 
  top-1/2 left-1/2 
  md:left-auto md:right-10 md:top-4 md:translate-x-0 md:translate-y-0
  transform -translate-x-1/2 -translate-y-1/2 
  w-[90%] md:w-2/5 
  px-4 py-6 
  bg-black/40 md:backdrop-blur-md 
  rounded-2xl shadow-2xl 
  flex flex-col space-y-6">
          {/* Header */}
          <main className="flex flex-row-reverse items-center justify-between  text-white">
            {/* Select Country */}
          <div className="flex flex-col items-center md:space-y-4 space-y-2" dir="rtl">
              <p className="md:text-lg  font-semibold">
                المدينة : {SelectedCity || "لم يتم الاختيار"}
              </p>
              <select
                name="Cities"
                id=""
                value={SelectedCity}
                onChange={HandleChange}
                className="bg-red-800/50 px-4 py-2 rounded-xl "
              >
                <option value="">اختر المحافظة</option>
                {governorates.map((city, index) => {
                  return (
                    <option
                      id={index}
                      value={city}
                      className="bg-red-900/50 overflow-hidden"
                    >
                      {city}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* Date */}
            <div className="md:space-y-4 space-y-2 md:text-xl font-semibold md:pl-24 " dir="rtl">
              <h1>التاريخ</h1>
              <p dir="ltr">{FormatDate}</p>
            </div>
          </main>
          <hr />
          {/* Prayer Times */}
          <main className="space-y-6">
            {prayerTimes ? (
              Object.entries(prayerTimes)
              .filter(([name])=> allowedPrayers.includes(name))
              .map(([name, times]) => (
                <div className="flex  justify-between bg-red-500/30   px-8 py-4 rounded-lg text-white text-xl" dir="rtl">
                  <h1>{prayerNames[name] || name}</h1>
                  <p>{convertTo12Hour(times)}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-white font-semibold">اختر محافظة لعرض مواقيت الصلاة</p>
            )}
          </main>
        </div>
      </section>
    </>
  );
};

export default Home;
