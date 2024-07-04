import React, { useState } from 'react'
import styles from './modal.module.css'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
  return (
    <div className={styles.ModalOverlay}>
    <div className={styles.Modal}>
      <button className={styles.ModalClose} onClick={onClose}>Close</button>
      <div className={styles.ModalContent}>
        {children}
      </div>
    </div>
  </div>
  )
}

export default Modal
