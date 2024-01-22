import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'isMatch' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedProperty, reverse] = args.constraints
        const relatedValue = (args.object as any)[relatedProperty]
        return reverse ? value !== relatedValue : value === relatedValue
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedProperty, reverse] = args.constraints
        return `${relatedProperty} and ${args.property} ${reverse ? `is` : `don't`} match`
    }
}

export function IsMatch(
    relatedProperty: string,
    reverse = false,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [relatedProperty, reverse],
            validator: MatchConstraint,
        })
    }
}
