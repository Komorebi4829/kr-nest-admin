import { NavLink } from 'react-router-dom'

interface Props {
  size?: number | string
}
function Logo({ size = 50 }: Props) {
  return (
    <NavLink to="/">
      <img className="size-[50px]" src="/src/assets/images/logo.png" alt="logo" />
    </NavLink>
  )
}

export default Logo
