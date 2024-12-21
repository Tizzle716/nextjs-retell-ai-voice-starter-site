import React from 'react';
import styles from './ElectrolumeStormsphere.module.css';
import { motion } from 'framer-motion';

interface ElectrolumeStormsphereProps {
  isAgent: boolean;
  isCustomer: boolean;
  isActive: boolean;
  children?: React.ReactNode;
}

const ElectrolumeStormsphere: React.FC<ElectrolumeStormsphereProps> = ({
  isAgent,
  isCustomer,
  isActive,
  children
}) => {
  return (
    <div className={styles.container}>
      <motion.div
        className={`${styles.orb} ${isAgent ? styles.agent : ''} ${isCustomer ? styles.customer : ''} ${isActive ? styles.active : ''}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.lightningBorder} />
        <div className={styles.messageContainer}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default ElectrolumeStormsphere;
