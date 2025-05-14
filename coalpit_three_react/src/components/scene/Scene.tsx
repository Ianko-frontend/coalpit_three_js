import React from 'react'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei';
import {observer} from "mobx-react";
import CoalpitView from "./CoalpitView";

const Scene = (observer(() => {
    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2}/>
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <OrbitControls/>
            <CoalpitView/>
        </Canvas>
    );
}));

export default Scene;