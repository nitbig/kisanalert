import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

const generateLeaves = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    startY: Math.random() * 100, // starting Y %
    scale: Math.random() * 0.4 + 0.3,
    duration: Math.random() * 15 + 15,
    delay: Math.random() * 15,
    rotation: Math.random() * 360,
  }));
};

export default function WindLeaves() {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    setLeaves(generateLeaves(20));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0]">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-[#3C8B5C]/20 dark:text-[#6EE7B7]/10"
          initial={{
            x: `-10vw`,
            y: `${leaf.startY}vh`,
            rotate: leaf.rotation,
            scale: leaf.scale,
          }}
          animate={{
            x: `110vw`,
            y: [`${leaf.startY}vh`, `${leaf.startY + 10}vh`, `${leaf.startY - 5}vh`, `${leaf.startY + 15}vh`],
            rotate: leaf.rotation + 720,
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
        >
          <Leaf className="w-8 h-8 fill-current" />
        </motion.div>
      ))}
    </div>
  );
}
