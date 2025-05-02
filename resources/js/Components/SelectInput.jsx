import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', children, options = [], ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (input.current) {
            input.current.focus();
        }
    }, []);

    return (
        <select
            {...props}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ' +
                className
            }
            ref={input}
        >
            {options.length > 0 
                ? options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
                : children
            }
        </select>
    );
}); 