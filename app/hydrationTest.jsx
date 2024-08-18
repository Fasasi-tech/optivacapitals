import dynamic from 'next/dynamic';

const NoSSRComponent = dynamic(() => import('./NoSSRComponent'), { ssr: false });

const HydrationTest = () => {

  // const a = Math.random();
  
  // console.log(a);

  return (
    <div>
        <NoSSRComponent />
    </div>
  )
}

export default HydrationTest