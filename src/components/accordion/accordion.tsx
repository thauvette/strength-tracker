import { h } from 'preact';
import { PropsWithChildren, useState } from 'preact/compat';
import AnimateHeight from 'react-animate-height';
import Icon from '../icon/Icon';

interface Props extends PropsWithChildren {
  openByDefault?: boolean;
  title: string;
  titleClass?: string;
  smallIcon?: boolean;
  headerClassName?: string;
  headerIcon?: string;
  containerClass?: string;
}

export default function Accordion({
  openByDefault = false,
  title,
  children,
  titleClass = '',
  smallIcon = false,
  headerClassName = '',
  headerIcon,
  containerClass = '',
}: Props) {
  const [isOpen, setIsOpen] = useState(openByDefault);

  return (
    <div class={containerClass}>
      <button
        class={`w-full ${headerClassName || ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div class="flex justify-between">
          <div class="flex items-center gap-2">
            {headerIcon ? <Icon name={headerIcon} width="28" /> : null}
            <p class={titleClass}>{title}</p>
          </div>
          <div
            class={`flex items-center transform transition-all duration-200 ${
              isOpen ? 'rotate-180' : ''
            } ${smallIcon ? 'text-lg' : 'text-2xl'}`}
          >
            <Icon name="chevron-down-outline" />
          </div>
        </div>
      </button>
      <AnimateHeight duration={200} height={isOpen ? 'auto' : 0}>
        {children}
      </AnimateHeight>
    </div>
  );
}
