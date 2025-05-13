import Image from 'next/image';

interface Props {
    placeholder?: string;
    name: string;
    image?: string;

    options: string[];

    setValue: (value: string) => void;
    value: string;
}

export default function Select({ placeholder, name, image, options, setValue, value }: Props) {
    return (
        <div className='select'>
            {image && <Image src={image} alt='image' width={18} height={18} />}
            <select
                className={`appearance-none w-full`}
                name={name}
                id={name}
                value={value}
                onInput={(event) => setValue(event.currentTarget.value)}
            >
                {placeholder && (
                    <option value='' disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option, index) => (
                    <option key={option + index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
