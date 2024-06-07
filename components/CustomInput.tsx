import { CustomInputProps } from '@/types';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

const CustomInput = ({ control, name, label, placeholder }: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='form-label'>{label}</FormLabel>
          <div className='flex flex-col w-full'>
            <FormControl>
              <Input
                type={name === 'password' ? 'password' : 'text'}
                placeholder={placeholder}
                className='form-input'
                {...field}
              />
            </FormControl>
            <FormMessage className='form-message mt-2' />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
