import { Object3DNode } from '@react-three/fiber'
import { SpotLight as ThreeSpotLight } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    spotLight: Object3DNode<ThreeSpotLight, typeof ThreeSpotLight>
  }
}