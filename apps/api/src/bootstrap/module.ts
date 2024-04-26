import { Module, ModuleMetadata, Type } from '@nestjs/common'

// const logger = new Logger('Bootstrap')

export function CreateModule(
    target: string | Type<any>,
    metaSetter: () => ModuleMetadata = () => ({}),
): Type<any> {
    let ModuleClass: Type<any>
    if (typeof target === 'string') {
        ModuleClass = class {}
        Object.defineProperty(ModuleClass, 'name', { value: target })
    } else {
        ModuleClass = target
    }
    // logger.debug(`CreateModule: ${target}`)
    Module(metaSetter())(ModuleClass)
    return ModuleClass
}
