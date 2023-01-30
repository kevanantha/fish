import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Popper } from 'react-popper'

import { usePaginationStore } from '../store/pagination'
import cls from './Pagination.module.scss'

interface PaginationProps {
  page: number
  // setPage: (page: number) => void
}

const Pagination = ({ page }: PaginationProps) => {
  // const {page} = usePaginationStore()
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const listboxRef = useRef<HTMLDivElement>(null);

  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const onSelect = (option: number) => {
    console.log('Selected: ', option)
  }

  return (
    <div onClick={toggleOpen} ref={listboxRef} style={{ width: '100%' }}>
      {/* <button className={cls.btnPagination} style={{ width: '200px' }}>click me</button> */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        style={{ marginTop: '1rem', backgroundColor: '#fff', width: 'inherit' }}
      >
        {isOpen && (
          <Popper placement="bottom-start" referenceElement={listboxRef.current}>
            {({ ref, style, placement }) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {options.map((option) => (
                  <motion.div
                    key={option}
                    onClick={() => {
                      onSelect(option);
                      close();
                    }}
                    whileHover={{ backgroundColor: '#ddd' }}
                    style={{
                      padding: '0.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    {option}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Popper>
        )}

        {/* <AnimatePresence> */}
        {/*   {isOpen && ( */}
        {/*     <motion.div */}
        {/*       initial={{ opacity: 0, y: 10 }} */}
        {/*       animate={{ opacity: 1, y: 0 }} */}
        {/*       exit={{ opacity: 0, y: 10 }} */}
        {/*     > */}
        {/*       {options.map((option) => ( */}
        {/*         <motion.div */}
        {/*           key={option} */}
        {/*           onClick={() => { */}
        {/*             onSelect(option); */}
        {/*             close(); */}
        {/*           }} */}
        {/*           whileHover={{ backgroundColor: '#ddd' }} */}
        {/*           style={{ */}
        {/*             padding: '0.5rem', */}
        {/*             cursor: 'pointer', */}
        {/*           }} */}
        {/*         > */}
        {/*           {option} */}
        {/*         </motion.div> */}
        {/*       ))} */}
        {/*     </motion.div> */}
        {/*   )} */}
        {/* </AnimatePresence> */}
      </motion.div>
    </div>
  )
}

export default Pagination
