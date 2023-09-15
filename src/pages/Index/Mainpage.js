import '../../css/style.css';
import { LeftMenu } from '../../components/LeftMenu';
import { ContentBase } from '../../components/ContentBase';

export function MainPage() {
    return (
        <>
        <ContentBase/>
        <div className='container'>
            <h1>Página Principal</h1>
        </div>
        </>
    );
}

