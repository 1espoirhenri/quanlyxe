import React, { useState, useEffect, useRef } from 'react';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import từ firebaseConfig
import L from 'leaflet'; // Import Leaflet
import Map from './Map.js'; // Import component Map
import './styles/globals.css';

const VehicleTrackingApp = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [vehicleLocation, setVehicleLocation] = useState(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vehicleMarker = useRef(null);
  const route = useRef(null);

  const vehicleMarkerIcon = L.icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png', // Thay bằng URL icon của xe
    iconSize: [30, 30],
  });

  const userMarkerIcon = L.icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309739_640.png', // Thay bằng URL icon của người dùng
    iconSize: [30, 30],
  });

  // Lấy vị trí hiện tại của người dùng
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Lỗi lấy vị trí:', error);
        }
      );
    }
  }, []);

  // Khởi tạo bản đồ
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

      // Marker cho vị trí người dùng
      L.marker([currentLocation.lat, currentLocation.lng], { icon: userMarkerIcon }).addTo(mapInstance.current);
    }
  }, [currentLocation]);

  // Hàm cập nhật vị trí xe từ Firebase
  const updateVehicleLocation = async () => {
    const docRef = doc(db, 'quanlyxe', 'vehicle1');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const newVehicleLocation = {
        lat: docSnap.data().lat,
        lng: docSnap.data().lng,
      };

      setVehicleLocation(newVehicleLocation);

      if (vehicleMarker.current) {
        vehicleMarker.current.setLatLng([newVehicleLocation.lat, newVehicleLocation.lng]);
      } else if (mapInstance.current) {
        vehicleMarker.current = L.marker([newVehicleLocation.lat, newVehicleLocation.lng], { icon: vehicleMarkerIcon })
          .addTo(mapInstance.current)
          .bindPopup(`Vị trí của xe: Lat: ${newVehicleLocation.lat}, Lng: ${newVehicleLocation.lng}`);
      }
    }
  };

  // Gọi hàm cập nhật vị trí xe mỗi 5 giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateVehicleLocation();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Xử lý bật/tắt báo động
  const toggleAlarm = async () => {
    setIsAlarmActive((prevState) => !prevState);
    const docRef = doc(db, 'quanlyxe', 'vehicle1');

    try {
      await setDoc(docRef, { alert: !isAlarmActive }, { merge: true });
      setAlertMessage(isAlarmActive ? 'Báo động đã được tắt!' : 'Báo động đã được bật!');
    } catch (error) {
      console.error('Lỗi cập nhật báo động:', error);
    }
  };

  // Hàm tìm đường tới xe
  const findRouteToVehicle = () => {
    if (!currentLocation || !vehicleLocation) {
      setAlertMessage("Vui lòng đợi vị trí của xe và người dùng được cập nhật.");
      return;
    }

    if (route.current) {
      mapInstance.current.removeControl(route.current);
    }

    route.current = L.Routing.control({
      waypoints: [
        L.latLng(currentLocation.lat, currentLocation.lng),
        L.latLng(vehicleLocation.lat, vehicleLocation.lng),
      ],
      routeWhileDragging: true,
      createMarker: () => null, // Không tạo marker mới
    }).addTo(mapInstance.current);
  };

  return (
    <div className="p-4 space-y-4">

      <header
        style={{
          textAlign: 'center',
          margin: '20px 0',
          display: 'flex',
          justifyContent: 'space-between', // Đảm bảo logo nằm ở 2 bên và tên nằm giữa
          alignItems: 'center',
          padding: '0 20px', // Đảm bảo có khoảng cách giữa các phần tử và viền màn hình
        }}
      >
        {/* Logo 1 */}
        <img
          src="/logo1.png" // Đường dẫn logo 1
          alt="Logo 1"
          style={{
            width: '50px',
            height: '50px',
          }}
        />

        {/* Tên website */}
        <h1
          style={{
            fontSize: '2em',
            color: '#000000',
            margin: '0', // Xóa margin để giữ khoảng cách đúng khi thu nhỏ
            textAlign: 'center', // Căn giữa tên
            flexGrow: 1, // Đảm bảo tên chiếm không gian giữa
          }}
        >
          Ứng Dụng Theo Dõi Vị Trí Xe
        </h1>

        {/* Logo 2 */}
        <img
          src="/logo2.png" // Đường dẫn logo 2
          alt="Logo 2"
          style={{
            width: '50px',
            height: '50px',
          }}
        />
      </header>


      {/* Thông báo */}
      {alertMessage && <div className="alert">{alertMessage}</div>}

      {/* Bản đồ */}
      <div id="map-container" ref={mapRef}></div>

      {/* Nút Báo Động */}
      <button
        onClick={toggleAlarm}
        className={`${
          isAlarmActive ? "bg-red-500 text-white" : "bg-white text-black border-black"
        }`}
      >
        {isAlarmActive ? "Tắt Báo Động" : "Bật Báo Động"}
      </button>

      {/* Container cho bảng chỉ dẫn */}
      <div id="responsive-routing"></div>

      {/* Nút Tìm Đường */}
      <button
        onClick={findRouteToVehicle}
        className="bg-blue-100 border-blue-500 text-black"
      >
        Tìm Đường Tới Xe
      </button>

      <footer style={{ textAlign: 'center', marginTop: '100px', fontSize: '0.9em', color: '#888' }}>
        <p>Phát triển bởi: <strong>Phan Duy Hoàng và Nguyễn Việt Hoàng</strong></p>
      </footer>
    </div>
  );
};

export default VehicleTrackingApp;
