import { Select } from 'antd'

import { SvgIcon } from '../icon'

function getLocalIconNames() {
    const iconNames: string[] = []
    const modules = import.meta.glob('../../assets/icons/*.svg', { eager: false })
    Object.keys(modules).forEach((key) => {
        const match = key.match(/\.\.\/\.\.\/assets\/icons\/(.+)\.svg$/)
        const name = match ? match[1] : ''
        iconNames.push(name)
    })
    return iconNames
}

export default function IconSelect() {
    // https://icon-sets.iconify.design/
    const iconNames = getLocalIconNames()
    return (
        <Select
            dropdownRender={(originNode) => {
                console.log('originNode', originNode)
                return originNode
            }}
            options={iconNames.map((name) => ({
                label: <SvgIcon icon={name} size={20} />,
                value: name,
            }))}
        />
    )
}
