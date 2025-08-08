import AcmeLogo from '@/app/ui/acme-logo';

import {lusitana} from '@/app/ui/fonts';

import {SpotifyLoginButton} from '@/app/ui/spotify-button';
import CodeExchangeHandler from '@/app/ui/CodeExchangeHandler';

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col p-6">
            <CodeExchangeHandler/>
            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
                <AcmeLogo/>
            </div>
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                    <div
                        className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
                    />
                    <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
                        <strong>Welcome to Gen Playlists.</strong>
                    </p>
                    <SpotifyLoginButton/>
                </div>

            </div>
        </main>
    );
}
