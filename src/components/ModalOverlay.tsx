import { motion } from 'framer-motion'
import classes from './ModalOverlay.module.scss'

interface ModalOverlayProps {
  children: React.ReactNode
  onClick: () => void
}

const ModalOverlay = ({ children, onClick }: ModalOverlayProps) => {
  return (
    <motion.div
      onClick={onClick}
      className={classes.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}

export default ModalOverlay
