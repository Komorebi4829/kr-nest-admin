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

type IconSelectProps = {
    onChange?: (value: string) => void
    value?: string
}

export default function IconSelect({ onChange, value = '' }: IconSelectProps) {
    // https://icon-sets.iconify.design/
    const iconNames = getLocalIconNames()
    const [open, setopen] = useState(false)
    const [iconName, seticonName] = useState<string>()

    const triggerChange = (changedValue: string) => {
        onChange?.(changedValue)
    }

    return (
        <Popover
            trigger={['focus', 'contextMenu']}
            open={open}
            placement="bottomLeft"
            overlayStyle={{ maxWidth: 300 }}
            overlayInnerStyle={{ maxHeight: 260 }}
            content={
                <div className="flex flex-wrap overflow-y-auto" onBlur={() => setopen(false)}>
                    {iconNames.map((name) => (
                        <IconButton
                            onClick={() => {
                                seticonName(name)
                                triggerChange(name)
                                setopen(false)
                            }}
                            className=""
                            key={name}
                        >
                            <SvgIcon icon={name} size={18} />
                        </IconButton>
                    ))}
                </div>
            }
        >
            <Input
                onFocus={() => setopen(true)}
                placeholder="Please select or input"
                addonBefore={<SvgIcon icon={value} size={18} />}
                value={value}
                readOnly
            />
        </Popover>
    )
}
