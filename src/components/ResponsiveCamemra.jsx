import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const ResponsiveCamera = () => {
  const { camera } = useThree();
  
  const adjustCamera = () => {
    const width = window.innerWidth;
    
    if (width < 640) { // Small mobile
      camera.position.set(0, 0, 8);
    } else if (width < 768) { // Mobile
      camera.position.set(0, 0, 7);
    } else if (width < 1024) { // Tablet
      camera.position.set(0, 0, 3.5);
    } else if (width < 1280) { // Small desktop
      camera.position.set(0, 0, 2.5);
    } else { // Large desktop
      camera.position.set(0, 0, 2);
    }
    camera.updateProjectionMatrix();
  };
  
  useEffect(() => {
    // Initial adjustment
    adjustCamera();
    
    // Add resize listener
    window.addEventListener('resize', adjustCamera);
    return () => window.removeEventListener('resize', adjustCamera);
  }, []);
  
  return null;
}

export default ResponsiveCamera;