import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const Map = ({ currentLocation, vehicleLocations }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // Tham chiếu đến bản đồ
  const markers = useRef([]); // Tham chiếu đến các markers
  const route = useRef(null); // Tham chiếu đến route

  useEffect(() => {
    if (!mapRef.current) return;

    // Khởi tạo bản đồ chỉ một lần
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
    }

    // Xóa các marker cũ trước khi thêm mới
    markers.current.forEach(marker => {
      if (marker) {
        mapInstance.current.removeLayer(marker);
      }
    });

    // Thêm markers mới
    markers.current = vehicleLocations.map(location => {
      const marker = L.marker([location.lat, location.lng])
        .addTo(mapInstance.current)
        .bindPopup(`Vị trí của xe: Lat: ${location.lat}, Lng: ${location.lng}`);
      return marker;
    });

    // Vẽ đường nếu cả hai vị trí đều có
    if (currentLocation && vehicleLocations.length > 0) {
      if (route.current) {
        mapInstance.current.removeControl(route.current); // Xóa route cũ
      }

      route.current = L.Routing.control({
        waypoints: [
          L.latLng(currentLocation.lat, currentLocation.lng),
          L.latLng(vehicleLocations[0].lat, vehicleLocations[0].lng),
        ],
        routeWhileDragging: true,
      }).addTo(mapInstance.current);

      // Di chuyển bảng chỉ dẫn ra ngoài bản đồ nếu màn hình nhỏ
      const routingContainer = document.querySelector('.leaflet-routing-container');
      const responsiveContainer = document.getElementById('responsive-routing');

      if (routingContainer && responsiveContainer) {
        if (window.innerWidth <= 768) {
          responsiveContainer.appendChild(routingContainer); // Chuyển bảng chỉ dẫn ra ngoài
        } else {
          mapInstance.current.getContainer().appendChild(routingContainer); // Trả lại bảng chỉ dẫn vào bản đồ
        }
      }

      // Xử lý sự kiện thay đổi kích thước màn hình
      const handleResize = () => {
        if (routingContainer && responsiveContainer) {
          if (window.innerWidth <= 768) {
            responsiveContainer.appendChild(routingContainer);
          } else {
            mapInstance.current.getContainer().appendChild(routingContainer);
          }
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup sự kiện resize
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [currentLocation, vehicleLocations]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Bản đồ */}
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>

      {/* Nút Báo Động */}
      <button
        className="bg-red-500 text-white w-full py-2 my-2"
        style={{ marginBottom: '10px' }}
      >
        Báo Động
      </button>

      {/* Container cho bảng chỉ dẫn khi responsive */}
      <div
        id="responsive-routing"
        style={{
          padding: '10px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Bảng chỉ dẫn sẽ được di chuyển vào đây khi màn hình nhỏ */}
        
      </div>
      
    </div>
    
  );
};

export default Map;
