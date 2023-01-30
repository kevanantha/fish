import React, { useState } from 'react';
import { Popper, PopperProps, Manager, Reference } from 'react-popper';
import cls from './Tooltip.module.scss'

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content, ...rest }: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div ref={ref} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            {children}
          </div>
        )}
      </Reference>
      <Popper placement="top" eventsEnabled={isOpen} {...rest}>
        {({ ref, style, placement, arrowProps }) => (
          <div
            ref={ref}
            style={style}
            data-placement={placement}
            className={cls.tooltip}
          >
            <div className={cls.tooltipArrow} ref={arrowProps.ref} style={arrowProps.style} />
            <div className={cls.tooltipInner}>{content}</div>
          </div>
        )}
      </Popper>
    </Manager>
  );
};

export default Tooltip;
