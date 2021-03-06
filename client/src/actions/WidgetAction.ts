import { createAction } from 'typesafe-actions'

const handleMenu = createAction('@@widget/ANCHOR_EL_CHANGE',
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (
        { moreButtonRef: e.currentTarget }
    )
)()
//the parens in return  dont really do anything, the curlies are for the object being returned with payload 
//property not braces for fn if add braces for fn need explicit return the object like above in logout.
const handleCloseMenu = createAction('@@widget/MENU_CLOSE',
    () => (
        { moreButtonRef: null }
    )
)()


const handleChangeSlider = createAction('@@slider/SLIDER_CHANGE',
    (e: React.ChangeEvent<{}>, value: number | number[]) => {
        return { values: value as number[] }
    }
)()



const widgetActions = {
    handleMenu,
    handleCloseMenu
};

export { widgetActions as WidgetAction }



const sliderActions = {
    handleChangeSlider
} 

export { sliderActions as SliderAction }