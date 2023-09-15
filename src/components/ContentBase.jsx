import '../css/style.css';
import { LeftMenu } from './LeftMenu';

export function ContentBase() {
    return (
        <>
            <LeftMenu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}></LeftMenu>
            <div className='container'>
                <div> 
                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>
        </>
    );
}

