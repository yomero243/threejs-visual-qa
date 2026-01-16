import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

interface ExperienceProps {
  testing?: boolean;
}

const BouncingText = ({ testing }: { testing: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const { viewport } = useThree()
  const velocity = useRef({ x: 5, y: 5 }) 

  const changeColor = () => {
    if (meshRef.current && meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const colors = ['red', 'green', 'blue']
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        meshRef.current.material.color.set(randomColor)
    }
  }

  useFrame((_state, delta) => {
    if (!meshRef.current) return

    if (testing) {
      const params = new URLSearchParams(window.location.search)
      const testColor = params.get('color') || 'red'

      meshRef.current.rotation.x = 0.3 // Un poco de inclinación para ver el extrude
      meshRef.current.rotation.y = 0.3
      meshRef.current.position.set(0, 0, 0)
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.color.set(testColor)
      }
      return
    }
    
    // 2. MODO SCREENSAVER DVD
    
    // Movimiento
    meshRef.current.position.x += velocity.current.x * delta
    meshRef.current.position.y += velocity.current.y * delta
    
    // NO ROTAR: Para mantener el efecto DVD clásico, mantenemos la rotación estática
    // Solo aplicamos una ligera inclinación fija si no se ha aplicado ya (podemos hacerlo en el render inicial o dejarlo fijo)
    // Aquí forzamos una ligera inclinación para que se vea el 3D, pero no gira.
    meshRef.current.rotation.x = 0.2
    meshRef.current.rotation.y = 0.1

    // Límites de rebote (ajustados para Text3D que suele ser más ancho/alto según la fuente)
    // Ajustamos un poco los márgenes porque el Text3D con Center puede variar
    const halfWidth = (viewport.width / 2) - 2.8 
    const halfHeight = (viewport.height / 2) - 1.0

    let bounced = false

    if (meshRef.current.position.x > halfWidth || meshRef.current.position.x < -halfWidth) {
      velocity.current.x *= -1
      bounced = true
    }

    if (meshRef.current.position.y > halfHeight || meshRef.current.position.y < -halfHeight) {
      velocity.current.y *= -1
      bounced = true
    }

    if (bounced) changeColor()
  })

  return (
    <Center>
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_bold.typeface.json" // Fuente estándar
        size={2}
        height={0.5} // Esto es el EXTRUDE
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.1}
        bevelSize={0.05}
        bevelOffset={0}
        bevelSegments={5}
      >
        testing
        <meshStandardMaterial color="orange" />
      </Text3D>
    </Center>
  )
}

export const Experience = ({ testing = false }: ExperienceProps) => {
  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh', background: '#ffffff' }}>
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 10] }}
      >
        <ambientLight intensity={0.5} /> 
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <BouncingText testing={testing} />

      </Canvas>
    </div>
  )
}