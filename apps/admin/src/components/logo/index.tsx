import { NavLink } from 'react-router-dom'

import LogoImg from '@/assets/images/logo.png'

interface Props {
  className?: string
}
function Logo({ className }: Props) {
  return (
    <NavLink to="/">
      <img className={className} src={LogoImg} alt="logo" />
    </NavLink>
  )
}

export default Logo
