import { Popover, Input } from 'antd'
import { useState } from 'react'

import { IconButton, SvgIcon } from '../icon'

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
    const [open, setopen] = useState(false)
    const [iconName, seticonName] = useState<string>()

    return (
        <Popover
            trigger="click"
            open={open}
            placement="bottomLeft"
            overlayStyle={{ maxWidth: 300 }}
            overlayInnerStyle={{ maxHeight: 260 }}
            content={
                <div className="flex flex-wrap overflow-y-auto">
                    {iconNames.map((name) => (
                        <IconButton onClick={() => seticonName(name)} className="">
                            <SvgIcon icon={name} size={18} />
                        </IconButton>
                    ))}
                </div>
            }
        >
            <Input onFocus={() => setopen(true)} onBlur={() => setopen(false)} />
        </Popover>
    )
}
