// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// const Modal = ({ isOpen, onClose, children }: Props) => {
//   const [isAnimating, setIsAnimating] = useState(false);

//   const handleClose = () => {
//     setIsAnimating(true);
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="modal-overlay"
//           onClick={handleClose}
//         >
//           <motion.div
//             initial={{ y: "-50%", opacity: 0 }}
//             animate={{ y: "50%", opacity: 1 }}
//             exit={{ y: "-50%", opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className={cls.modalContainer}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {children}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ModalOverlay from './ModalOverlay'
import cls from './Modal.module.scss';

interface ModalProps {
  children: React.ReactNode;
  title: string
  isOpen: boolean
  onClose: () => void
}

const Modal = ({ children, title, isOpen, onClose }: ModalProps) => {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay onClick={onClose}>
            <motion.div
              className={cls.modalContainer}
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <header style={{ paddingBottom: '24px', fontSize: '1.25rem', fontWeight: 600 }}>{ title }</header>
              <button type='button' aria-label='Close' className={cls.modalClose} onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
              {children}
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
